extends CanvasLayer

var enable_shaders: bool = false

@onready var color_rect: ColorRect = $ColorRect

# Assuming you have a ShaderMaterial assigned to the ColorRect originally
@onready var shader_material: ShaderMaterial = color_rect.material

func _process(_delta: float) -> void:
	# Enable or disable the shader material based on enable_shaders variable
	color_rect.visible = enable_shaders
	if enable_shaders:
		color_rect.material = shader_material
	else:
		color_rect.material = null
		
