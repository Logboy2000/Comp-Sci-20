extends GPUParticles2D

func _ready() -> void:
	emitting = true
	interpolate = false
	fixed_fps = round(DisplayServer.screen_get_refresh_rate())


func _on_finished() -> void:
	queue_free()
