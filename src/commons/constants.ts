const constants = {
  MESSAGES: {
    INTERNAL_SERVER_ERROR: "An unexpected error occurred",
    PRACTICE: {
      PLAYER_ID_NULL: "Practice playerId should be specified",
      PLAYER_ID_NOT_VALID: "Can't find player with id",
      DATE_NOT_VALID: "Practice date should be specified and matches MM-DD-YYYY pattern",
      NAME_NULL: "Practice date should be specified",
      DATE_NOT_IN_FUTURE: "Practice date should be in future",
    }
  },

  PATH: {
    BLANK: "/",
    PRACTICE: "/practice",
    COUNTS: "/_counts",
  }

}

export default constants;