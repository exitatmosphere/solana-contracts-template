use anchor_lang::{prelude::*, Discriminator};

use crate::{GreetingData, GreeterError, GREETING_ACCOUNT_SEED_PHRASE};

pub(crate) fn set_greeting(ctx: Context<SetGreeting>, greeting: String) -> Result<()> {
    require!(greeting.len() != 0, GreeterError::GreeterZeroLengthGreeting);

    let old_greeting = ctx.accounts.greeting_account.greeting.clone();
    ctx.accounts.greeting_account.greeting = greeting.clone();

    msg!("Changing greeting from {:?} to {:?}", old_greeting, greeting);
    Ok(())
}

#[derive(Accounts)]
pub struct SetGreeting<'info> {
    #[account(
        mut
    )]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        space = GreetingData::DISCRIMINATOR.len() + GreetingData::INIT_SPACE,
        seeds = [GREETING_ACCOUNT_SEED_PHRASE],
        bump,
    )]
    pub greeting_account: Account<'info, GreetingData>,
    pub system_program: Program<'info, System>,
}
