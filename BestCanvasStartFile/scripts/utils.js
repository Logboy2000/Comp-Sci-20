function lerp(startValue, targetValue, interpolationFactor) {
    return startValue + (targetValue - startValue) * interpolationFactor
}