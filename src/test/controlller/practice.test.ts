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

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

app.use(bodyParser.json({limit: '1mb'}));
app.use('', practice);


const practices = [
  {
    _id: new ObjectId().toString(),
    name: "Training1",
    playerId: 1,
    date: "2024-10-23T22:00:00.000Z"
  },
  {
    _id: new ObjectId().toString(),
    name: "Training2",
    playerId: 2,
    date: "2024-10-24T22:00:00.000Z"
  },
  {
    _id: new ObjectId().toString(),
    name: "Training3",
    playerId: 1,
    date: "2024-10-23T22:00:00.000Z"
  }
]


describe('Practice controller', () => {
  before(async () => {
    await mongoSetup;
    await Practice.insertMany(practices)
  });

  // beforeEach(async () => {
  //   await Practice.insertMany(practices)
  // })

  afterEach(() => {
    sandbox.restore();
  });

  it('should return practices when correct playerId given', (done) => {
      chai.request(app)
        .get('?playerId=1')
        .end((_, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal(practices.filter(practice => practice.playerId === 1));
          done();
        });
    },
  );
  it('should return practices when correct playerId, size, from given', (done) => {
      chai.request(app)
        .get('?playerId=1&&size=1&&from=1')
        .end((_, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal([practices[2]]);
          done();
        });
    },
  );

  it("should throw not found error when player with given id doesn't exists", (done) => {
      chai.request(app)
        .get('?playerId=300')
        .end((_, res) => {
          res.should.have.status(404);
          done();
        });
    },
  );

  it('should create practice when correct data is given', (done) => {
      const practiceToCreate = {
        name: "Training1",
        playerId: 1,
        date: new Date('2025-01-01')
      }

    const validatePlayerIdStub = sinon.stub(practiceService, 'validatePlayerId').resolves();

      chai.request(app)
        .post('')
        .send({...practiceToCreate})
        .end((_, res) => {
          console.log('res',res)
          sinon.assert.calledOnce(validatePlayerIdStub);
          res.should.have.status(201);
          done();
        });
    },
  );


  it('should count practice by given playerIds"', (done) => {
      const requestBody = {
        playerIds: ["1", "2"]
      };

      const expectedResponseBody = [
        {
          "_id": 1,
          "count": 2
        },
        {
          "_id": 2,
          "count": 1
        }]

      chai.request(app)
        .post('/_counts')
        .send({...requestBody})
        .end((_, res) => {
          res.should.have.status(200);
          expect(res.body).to.deep.equal(expectedResponseBody);
          done();
        });
    },
  );

});
