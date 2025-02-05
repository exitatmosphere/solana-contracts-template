use anchor_lang::error_code;

#[error_code]
pub enum GreeterError {
    #[msg("Greeting string can't be empty")]
    GreeterZeroLengthGreeting,
}
