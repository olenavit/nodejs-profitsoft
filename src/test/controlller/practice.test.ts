import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import practice from "src/router/practice";
import * as practiceService from "src/service/practice";
import mongoSetup from "src/test/mongoSetup";
import Practice from "src/model/practice";

const {expect} = chai;
import {ObjectId} from 'mongodb';
import {BAD_REQUEST, CREATED, NOT_FOUND, OK} from "http-status";
import Constants from "src/commons/constants";
import {HttpError} from "src/system/httpError";

chai.use(chaiHttp);
chai.should();

const app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use('', practice);


const practices = [
  {
    _id: new ObjectId().toString(),
    name: "Training1",
    playerId: 1,
    date: "2024-10-23T22:00:00.000Z",
  },
  {
    _id: new ObjectId().toString(),
    name: "Training2",
    playerId: 2,
    date: "2024-10-24T22:00:00.000Z",
  },
  {
    _id: new ObjectId().toString(),
    name: "Training3",
    playerId: 1,
    date: "2024-10-23T22:00:00.000Z",
  },
];


describe('Practice controller', () => {


  const sandbox = sinon.createSandbox();
  const validatePlayerIdStub = sinon.stub(practiceService, 'validatePlayerId');

  before(async () => {
    await mongoSetup;
    await Practice.insertMany(practices);
  });


  afterEach(() => {
    sandbox.restore();
  });

  it('should return practices when correct playerId given', (done) => {
    chai.request(app)
      .get('?playerId=1')
      .end((_, res) => {
        res.should.have.status(OK);
        expect(res.body).to.deep.equal(practices.filter(practice => practice.playerId === 1));
        done();
      });
  },
  );

  it('should return BAD_REQUEST error when wrong player id given', (done) => {
    chai.request(app)
      .get('?playerId=wrong')
      .end((_, res) => {
        res.should.have.status(BAD_REQUEST);
        done();
      });
  },
  );

  it('should return practices when correct playerId, size, from given', (done) => {
    chai.request(app)
      .get('?playerId=1&&size=1&&from=1')
      .end((_, res) => {
        res.should.have.status(OK);
        expect(res.body).to.deep.equal([practices[2]]);
        done();
      });
  },
  );


  it('should return practices when wrong size, from given', (done) => {
    chai.request(app)
      .get('?playerId=1&&size=wrong&&from=wrong')
      .end((_, res) => {
        res.should.have.status(BAD_REQUEST);
        expect(res.body.message).contain(Constants.MESSAGES.QUERY_PARAMS.FROM_NOT_VALID);
        expect(res.body.message).contain(Constants.MESSAGES.QUERY_PARAMS.SIZE_NOT_VALID);
        done();
      });
  },
  );

  it("should return NOT_FOUND error when player with given id doesn't exists", (done) => {
    chai.request(app)
      .get('?playerId=300')
      .end((_, res) => {
        res.should.have.status(NOT_FOUND);
        expect(res.body.message).to.equal(Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_FOUND + "300");
        done();
      });
  },
  );

  it('should create practice when correct data is given', (done) => {
    const practiceToCreate = {
      name: "Training1",
      playerId: 3,
      date: '2025-01-01',
    };

    validatePlayerIdStub.resolves();

    chai.request(app)
      .post('')
      .send({...practiceToCreate})
      .end((_, res) => {
        sinon.assert.calledOnce(validatePlayerIdStub);
        res.should.have.status(CREATED);
        done();
      });
  },
  );
  it('should not create practice when wrong data is given', (done) => {
    const practiceToCreate = {
      name: "1",
      playerId: "",
      date: '2022-01-01',
    };

    validatePlayerIdStub.resolves();

    chai.request(app)
      .post('')
      .send({...practiceToCreate})
      .end((_, res) => {
        sinon.assert.calledOnce(validatePlayerIdStub);
        res.should.have.status(BAD_REQUEST);
        expect(res.body.message).contain(Constants.MESSAGES.PRACTICE.NAME_NOT_VALID);
        expect(res.body.message).contain(Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_VALID);
        expect(res.body.message).contain(Constants.MESSAGES.PRACTICE.DATE_IN_FUTURE);
        done();
      });
  },
  );


  it("should not create practice when playerId doesnt exist", (done) => {
    const practiceToCreate = {
      name: "Training1",
      playerId: 3,
      date: '2025-01-01',
    };

    validatePlayerIdStub.throws(new HttpError(Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_FOUND + practiceToCreate.playerId, NOT_FOUND));

    chai.request(app)
      .post('')
      .send({...practiceToCreate})
      .end((_, res) => {
        res.should.have.status(NOT_FOUND);
        expect(res.body.message).to.equal(Constants.MESSAGES.PRACTICE.PLAYER_ID_NOT_FOUND + practiceToCreate.playerId);
        done();
      });
  },
  );


  it('should count practice by given playerIds"', (done) => {
    const requestBody = {
      playerIds: ["1", "2"],
    };

    const expectedResponseBody = [
      {
        "_id": 1,
        "count": 2,
      },
      {
        "_id": 2,
        "count": 1,
      }];

    chai.request(app)
      .post(Constants.PATH.COUNTS)
      .send({...requestBody})
      .end((_, res) => {
        res.should.have.status(OK);
        expect(res.body).to.deep.equal(expectedResponseBody);
        done();
      });
  },
  );


  it('should not count practice when wrong data is given', (done) => {
    const requestBody = {
      playerIds: 9,
    };
    chai.request(app)
      .post(Constants.PATH.COUNTS)
      .send({...requestBody})
      .end((_, res) => {
        res.should.have.status(BAD_REQUEST);
        expect(res.body.message).to.equal(Constants.MESSAGES.PRACTICE.PLAYER_IDS_NOT_VALID);
        done();
      });
  },
  );

});
