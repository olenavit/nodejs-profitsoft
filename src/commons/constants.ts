const constants = {
  MESSAGES: {
    INTERNAL_SERVER_ERROR: "An unexpected error occurred",
    PRACTICE: {
      PLAYER_ID_NULL: "Practice playerId should be specified",
      PLAYER_ID_NOT_VALID: "PlayerId should be a string",
      PLAYER_ID_NOT_FOUND: `Player not found with id = `,
      DATE_NOT_VALID: "Practice date should matches YYYY-MM-DD pattern",
      DATE_IN_FUTURE: "Practice date should be in future",
      DATE_NULL: "Practice date should be specified",
      NAME_NULL: "Practice name should be specified",
      NAME_NOT_VALID: "Practice date should be at least 3 characters long",
      DATE_NOT_IN_FUTURE: "Practice date should be in future",
      PLAYER_IDS_NOT_VALID: "Player ids should be an array",
      PLAYER_IDS_NULL: "Player ids should be specified",
    },
    QUERY_PARAMS: {
      SIZE_NOT_VALID: "Size should be a number",
      FROM_NOT_VALID: "From should be a number",
    },
  },

  PATH: {
    BLANK: "/",
    PRACTICE: "/practice",
    COUNTS: "/_counts",
  },

};

export default constants;