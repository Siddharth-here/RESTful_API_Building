class ApiError extends Error{
  constructor(statusCode, message){
    super(message)
    this.statusCode=statusCode
  }
}

throw new ApiError("");
