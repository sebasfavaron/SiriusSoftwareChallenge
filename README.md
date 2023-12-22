# SiriusSoftwareChallenge

Two independent challenges

1. Frontend: React site with a /pokemon route that loads all pokemon and a /pokemon/:id to see more details about that pokemon.
2. Backend: ExpressJS server that exposes an endpoint to send an email using Sendgrid (or Mailgun as a failover). There's also a daily quota per user to avoid abuse. Limitation: because we use test accounts in this POC for Sendgrid and Mailgun the sender email has to be fixed so it cannot be set to the user's personal email
