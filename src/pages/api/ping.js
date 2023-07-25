export default async function handler (req, res) {


    // Hobby accounts are limited to daily cron jobs. 
    // This cron expression (*/5 * * * *) would run more than once per day. Upgrade to pro to unlock all Cron Jobs features on Vercel.

    // https://github.com/vercel/vercel/issues/189
    res.status(200).json({ping: 'pong'})

}