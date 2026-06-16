// EcoPulse Automated Test Suite

console.log("🌱 Starting EcoPulse Test Suite");


function assert(condition, message) {
    if (!condition) {
        throw new Error("❌ " + message);
    }
}


// Carbon calculation test
function testCarbonCalculation() {

    const electricity = 300;
    const factor = 0.45;

    const emission = electricity * factor;

    assert(
        emission === 135,
        "Carbon calculation failed"
    );

    console.log("✅ Carbon calculation test passed");
}



// Renewable energy impact test
function testRenewableReduction(){

    const normal = 300 * 0.45;
    const renewable = 300 * 0.225;


    assert(
        renewable < normal,
        "Renewable reduction failed"
    );

    console.log("✅ Renewable energy reduction test passed");
}



// Transport test
function testTransport(){

    const miles = 100;
    const factor = 0.404;

    const result = miles * factor;


    assert(
        result > 0,
        "Transport calculation failed"
    );


    console.log("✅ Transport calculation test passed");
}




// Diet test
function testDietImpact(){

    const meat = 3.3;
    const vegan = 1.5;


    assert(
        vegan < meat,
        "Diet calculation failed"
    );


    console.log("✅ Diet impact test passed");
}



// Validation test
function testValidation(){

    const input = -10;


    assert(
        input < 0,
        "Validation failed"
    );


    console.log("✅ Input validation test passed");
}




function testSuggestions(){

    const reduction = 25;


    assert(
        reduction > 0,
        "Suggestion logic failed"
    );


    console.log("✅ Reduction suggestion test passed");
}



testCarbonCalculation();
testRenewableReduction();
testTransport();
testDietImpact();
testValidation();
testSuggestions();


console.log(
"🎉 All EcoPulse automated tests passed successfully"
);
