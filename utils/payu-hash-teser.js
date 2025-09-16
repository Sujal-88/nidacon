// utils/payu-hash-tester.js
// Run this file with: node utils/payu-hash-tester.js

const crypto = require('crypto');

// Test data from your error message
const testData = {
    key: 'gtKFFx',
    txnid: 'NIDA1758017115832',
    amount: '2000.0',
    productinfo: 'NIDACON 2026 - delegate',
    firstname: 'Sujal Kothale',
    email: 'rangcreation555@gmail.com',
    udf1: 'RCOEM, Guttikhadan, Nagpur RCOEM',
    udf2: 'delegate',
    udf3: 'rc-member',
    udf4: 'life-member',
    udf5: '',
    salt: '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW' // Correct SALT from PayU error
};

// Expected hash from PayU
const expectedHashes = {
    v1: "04c21cc35fa5e7ace7a311c90f8698ea1870940d9444cd8bd67d86172aee97a5f4a8a324fb5532158e9459c1bdc34c10140df10d13c6bf313ba777f007eb04d5",
    v2: "3e5d7c274be5a348297962d2e4cb2a5a660002f820885ad82a90d945357ab65fcf0b2b87d9ff5bbcf7239e45bafb3dd460e34ead7c176776cac0927024da8b63"
};

// Your generated hash
const yourHash = "51fb72a199ab4bb197fe0fc553bae565cc78124b36d1c3f47351668350fc1f1fce6edf74dccde7ec45084de1d90135ac64a37620b6c0d5a61dbe97ae1159a1d3";

function testHashCalculation() {
    console.log('=== PayU Hash Calculation Test ===\n');
    
    // Build hash string according to PayU formula
    const hashString = `${testData.key}|${testData.txnid}|${testData.amount}|${testData.productinfo}|${testData.firstname}|${testData.email}|${testData.udf1}|${testData.udf2}|${testData.udf3}|${testData.udf4}|${testData.udf5}||||||${testData.salt}`;
    
    console.log('Hash String:');
    console.log(hashString);
    console.log('\nHash String Length:', hashString.length);
    console.log('');
    
    // Calculate hash
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    
    console.log('Calculated Hash:');
    console.log(calculatedHash);
    console.log('');
    
    console.log('Expected Hash (v1):');
    console.log(expectedHashes.v1);
    console.log('');
    
    console.log('Expected Hash (v2):');
    console.log(expectedHashes.v2);
    console.log('');
    
    console.log('Your Previous Hash:');
    console.log(yourHash);
    console.log('');
    
    // Check matches
    console.log('=== RESULTS ===');
    console.log('Hash matches v1:', calculatedHash === expectedHashes.v1);
    console.log('Hash matches v2:', calculatedHash === expectedHashes.v2);
    console.log('Hash matches your previous:', calculatedHash === yourHash);
    
    if (calculatedHash === expectedHashes.v1 || calculatedHash === expectedHashes.v2) {
        console.log('✅ SUCCESS: Hash calculation is correct!');
    } else {
        console.log('❌ FAILED: Hash calculation is incorrect');
        console.log('\nDebugging Info:');
        console.log('- Check if SALT is correct in your .env file');
        console.log('- Verify all UDF values are exactly as expected');
        console.log('- Ensure no extra spaces or special characters');
    }
}

// Test different variations
function testVariations() {
    console.log('\n\n=== Testing Different SALT Values ===\n');
    
    const salts = [
        'eCwWELxi', // Your current SALT
        '4R38IvwiV57FwVpsgOvTXBdLE4tHUXFW' // Expected SALT
    ];
    
    salts.forEach((salt, index) => {
        const hashString = `${testData.key}|${testData.txnid}|${testData.amount}|${testData.productinfo}|${testData.firstname}|${testData.email}|${testData.udf1}|${testData.udf2}|${testData.udf3}|${testData.udf4}|${testData.udf5}||||||${salt}`;
        const hash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        console.log(`SALT ${index + 1}: ${salt}`);
        console.log(`Generated Hash: ${hash}`);
        console.log(`Matches Expected: ${hash === expectedHashes.v1 || hash === expectedHashes.v2}`);
        console.log('---');
    });
}

// Run tests
testHashCalculation();
testVariations();

// Export for use in other files
module.exports = {
    testHashCalculation,
    testVariations,
    calculatePayUHash: (data) => {
        const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|${data.udf1}|${data.udf2}|${data.udf3}|${data.udf4}|${data.udf5}||||||${data.salt}`;
        return crypto.createHash('sha512').update(hashString).digest('hex');
    }
};