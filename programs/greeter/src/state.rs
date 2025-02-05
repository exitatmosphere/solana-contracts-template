use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct GreetingData {
    #[max_len(50)]
    pub greeting: String
}
