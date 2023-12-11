class AppError extends error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
module.exports = AppError;
