extends Node
var debug_mode: bool = false
var current_room: Room

func _ready() -> void:
	process_mode = ProcessMode.PROCESS_MODE_ALWAYS

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("fullscreen"):
		if DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED)
		else:
			DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	if Input.is_action_just_pressed("toggle_shaders"):
		ShaderFilter.enable_shaders = !ShaderFilter.enable_shaders
	if Input.is_action_just_pressed("reset"):
		TransitionLayer.change_scene(get_tree().current_scene.scene_file_path)

func shake_camera(intensity: float):
	if current_room:
		var camera = current_room.camera
		camera.addons[0].intensity = intensity
		camera.addons[0].shake()
		

func quit_game():
	await TransitionLayer.play_transition(false, 0.25)
	get_tree().quit(69)