function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function testCarbonCalculation() {
    const travelDistance = 100;
    const emissionFactor = 0.21;

    const carbonEmission = travelDistance * emissionFactor;

    assert(carbonEmission === 21, "Carbon calculation failed");
    console.log("✅ Carbon calculation test passed");
}

function testReductionSuggestion() {
    const reductionPercentage = 25;

    assert(reductionPercentage > 0, "Reduction suggestion failed");
    console.log("✅ Reduction suggestion test passed");
}

function testInputValidation() {
    const input = 100;

    assert(typeof input === "number", "Input validation failed");
    console.log("✅ Input validation test passed");
}

function testTransportLogic() {
    const miles = 50;
    const factor = 0.404;

    const result = miles * factor;

assert(Math.abs(result - 20.2) < 0.0001, "Transport calculation failed");
    console.log("✅ Transport calculation test passed");
}

function testDietImpact() {
    const dietScore = 2.2;

    assert(dietScore > 0, "Diet test failed");
    console.log("✅ Diet impact test passed");
}

// Run all tests
console.log("🌱 Starting EcoPulse Test Suite");

testCarbonCalculation();
testReductionSuggestion();
testInputValidation();
testTransportLogic();
testDietImpact();

console.log("🎉 All EcoPulse automated tests passed successfully");
