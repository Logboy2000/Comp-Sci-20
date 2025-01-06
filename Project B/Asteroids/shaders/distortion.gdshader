shader_type canvas_item;

uniform float ripple_strength : hint_range(0.0, 1.0);  // Strength of the ripple effect
uniform float time : hint_range(0.0, 10.0);  // Time for animation (can be animated in the script)
uniform vec2 center;  // The center of the distortion (usually the middle of the rect)
uniform float edge_thickness : hint_range(0.0, 1.0);  // Thickness of the edge where the distortion is applied

void fragment() {
    vec2 uv = FRAGCOORD.xy / SCREEN_PIXEL_SIZE;  // Normalized coordinates (0.0 to 1.0)

    // Calculate distance from the center of the ColorRect
    float dist_from_center = length(uv - center);

    // Determine if we're close enough to the edge for the ripple effect to be visible
    float edge_distortion = smoothstep(0.0, edge_thickness, dist_from_center);  // Soft edge for the effect

    // Apply a sine wave function for the ripple
    float ripple = sin(dist_from_center * 10.0 - time * 5.0) * ripple_strength;
    uv += (uv - center) * ripple * edge_distortion;  // Apply the ripple distortion to UV coordinates

    // Sample the texture with the distorted UVs (applying the shader to the texture)
    vec4 color = texture(TEXTURE, uv);
    COLOR = color;
}
