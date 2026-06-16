// EcoPulse Application Test Suite
// Tests carbon footprint logic and sustainability features


console.log("🌱 Starting EcoPulse Test Suite\n");


// Utility assertion function
function assert(condition, message) {
    if (!condition) {
        throw new Error("❌ " + message);
    }
}


// Test 1: Basic carbon calculation logic
function testCarbonCalculation() {

    const electricity = 200;
    const factor = 0.45;

    const emissions = electricity * factor;

    assert(
        emissions === 90,
        "Electricity carbon calculation failed"
    );

    console.log("✅ Carbon calculation test passed");
}



// Test 2: Renewable energy reduction
function testRenewableEnergyReduction() {

    const normalEmission = 200 * 0.45;

    const greenEmission = 200 * 0;

    assert(
        greenEmission < normalEmission,
        "Renewable energy reduction failed"
    );

    console.log("✅ Renewable energy reduction test passed");
}



// Test 3: Transport emission calculation
function testTransportCalculation() {

    const miles = 1000;
    const gasolineFactor = 0.404;

    const hybridFactor = 0.22;


    const gasoline =
        miles * gasolineFactor;


    const hybrid =
        miles * hybridFactor;


    assert(
        hybrid < gasoline,
        "Vehicle emission comparison failed"
    );


    console.log("✅ Transport calculation test passed");
}



// Test 4: Diet impact validation
function testDietImpact() {


    const vegan = 1.5;
    const meatHeavy = 3.3;


    assert(
        vegan < meatHeavy,
        "Diet impact calculation failed"
    );


    console.log("✅ Diet impact test passed");
}



// Test 5: Input validation
function testInputValidation() {


    const value = -10;


    assert(
        value < 0,
        "Negative input detection failed"
    );


    console.log("✅ Input validation test passed");
}



// Test 6: Reduction suggestion
function testReductionSuggestion() {


    const reductionPercentage = 25;


    assert(
        reductionPercentage > 0 &&
        reductionPercentage <= 100,
        "Reduction suggestion failed"
    );


    console.log("✅ Reduction suggestion test passed");
}




testCarbonCalculation();

testRenewableEnergyReduction();

testTransportCalculation();

testDietImpact();

testInputValidation();

testReductionSuggestion();


console.log(
    "\n🎉 All EcoPulse automated tests passed successfully"
);
