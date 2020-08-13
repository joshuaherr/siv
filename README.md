# SIV Demo

## How to use

Install dependencies and run:

```bash
yarn
yarn dev
```

TODO:

- [x] Admin GUI to add voters by email address
- [x] Admin GUI to add Trustees by email address
- [ ] Trustee page to take part in Distribute Key Gen
  - [x] Simulated
- [x] Backend assigns vote tokens and emails invitation to voters
  - [x] Password protect
- [x] Voter interface to cast vote
- [x] Encrypt voters vote
  - [x] Error handling
  - [ ] Walk voters through extra private mode
  - [ ] Health / Antivirus on browser checker
- [x] Submit Voters vote
  - [ ] Validate ballot before sending
- [x] Admin endpoint to receive submitted votes & validate vote token
- [ ] Bulletin board of all valid received votes
- [ ] Admin sends voter confirmation that vote was received
- [ ] Admin can assign time for voting to close
- [ ] Admin can manually close voting early
- [ ] Admin does first shuffle
- [ ] Trustee interface for their shuffle
- [ ] Trustees preform partial decryption
- [ ] Admin posts final results
