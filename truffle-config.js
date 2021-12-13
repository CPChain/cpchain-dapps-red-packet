/**
* Use this file to configure your truffle project. It's seeded with some
* common settings for different networks and features like migrations,
* compilation and testing. Uncomment the ones you need or modify
* them to suit your project as necessary.
*
* More information about configuration can be found at:
*
* trufflesuite.com/docs/advanced/configuration
*/

// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
    // Configure your compilers
    compilers: {
        solc: {
            version: "0.4.25",    // Fetch exact version from solc-bin (default: truffle's version)
            docker: true,         // Use "0.5.1" you've installed locally with docker (default: false)
            // settings: {          // See the solidity docs for advice about optimization and evmVersion
            //  optimizer: {
            //    enabled: false,
            //    runs: 200
            //  },
            //  evmVersion: "byzantium"
            // }
        }
    },

    // Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
    //
    // Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
    // those previously migrated contracts available in the .db directory, you will need to run the following:
    // $ truffle migrate --reset --compile-all

    db: {
        enabled: false
    },

    plugins: ["solidity-coverage"]
};
