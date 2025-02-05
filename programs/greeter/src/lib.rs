pub mod constants;
pub mod error;
pub mod state;
mod instructions;

use anchor_lang::prelude::*;

use constants::*;
use error::*;
use state::*;
use instructions::*;

declare_id!("6F4B6DAf1K5kFY4JjKcDTfyQbGTK4yeTtbMEiXeAjZBj");

#[program]
pub mod greeter {
    use super::*;

    pub fn set_greeting(ctx: Context<SetGreeting>, greeting: String) -> Result<()> {
        return instructions::set_greeting(ctx, greeting);
    }
}
