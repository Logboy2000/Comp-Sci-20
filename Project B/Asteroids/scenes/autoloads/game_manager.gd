extends Node

signal game_over_signal
signal coins_increased

var debug_mode: bool = false
var current_room: Room
var player: Player
var can_pause = true
var camera
var coins: int = 0

var settings: Dictionary = {
	"camera_shake": true,
	"upgrade_count": 4,
	"show_bg": true,
	"do_shoot_delay": true,
}
var save: Dictionary = {
	"played_tutorial": true
}


func _ready() -> void:
	process_mode = ProcessMode.PROCESS_MODE_ALWAYS

func _process(_delta: float) -> void:
	if current_room != null:
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
	if Input.is_action_just_pressed("cheat"):
		coins += 10000000
		Upgrades.cheat()

func change_coins_by(amount: int):
	if amount > 0:
		coins_increased.emit()
	coins += amount

func shake_camera(intensity: float):
	if current_room and settings.get("camera_shake") == true:
		camera.addons[0].intensity = intensity
		camera.addons[0].shake()

func set_cam_zoom(zoom: float):
	camera.zoom = zoom

func game_over():
	set_cam_zoom(0.5)
	game_over_signal.emit()

func quit_game():
	await TransitionLayer.play_transition(false)
	get_tree().change_scene_to_file("res://scenes/rooms/empty_room.tscn")
	ShaderFilter.enable_shaders = false
	await get_tree().create_timer(0.5).timeout
	await TransitionLayer.play_transition(true)
	
	get_tree().quit(69)

func add_entity(entity: Node):
	current_room.add_entity(entity)
