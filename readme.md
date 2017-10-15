## etherimp
### ethereum smart contract based on Robert Louis Stevenson's "The Bottle Imp" (1891)

> "You have bought it for less than I paid for it," replied the man, rubbing his hands. "It is yours now; and, for my part, I am only concerned to see the back of you."
> -<cite>[The Bottle Imp](http://gutenberg.spiegel.de/buch/the-bottle-imp-4357/1)</cite>

#### Background

Simple ethereum contract designed to run on [testrpc](https://github.com/ethereumjs/testrpc) without using frameworks: just a `Makefile` and some node.js needed.

Just like in "The Bottle Imp", this contract allows only one owner at a time, _and whenever the bottle is transferred to a new owner it must be sold at a loss._

However, unlike the original short story if this smart contract is very unlikely to curse you and contains no known supernatural entities. The full source code is in `contracts/`.

*Requirements:* node.js >= `8.6.0` and testrpc >= 4.1.3

*Installing dependencies:* `npm install`

#### Interacting with the contract

Make sure testrpc is running (default options are fine), then run: `make shell`

Tests are a work-in-progress but can be run using: `make test`

