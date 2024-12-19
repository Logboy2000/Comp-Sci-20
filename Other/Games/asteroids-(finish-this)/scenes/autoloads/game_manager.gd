extends Node

signal game_over_signal

var debug_mode: bool = false
var current_room: Room
var current_zoom: float = 1
var can_pause = true
var camera

var settings: Dictionary = {
	"camera_shake": true
}

func _ready() -> void:
	
	process_mode = ProcessMode.PROCESS_MODE_ALWAYS

func _process(_delta: float) -> void:
	camera = current_room.camera
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
	if current_room and settings.get("camera_shake") == true:
		camera.addons[0].intensity = intensity
		camera.addons[0].shake()
		

func game_over():
	camera.zoom = 2
	game_over_signal.emit()

func quit_game():
	await TransitionLayer.play_transition(false, 0.25)
	get_tree().quit(69)
