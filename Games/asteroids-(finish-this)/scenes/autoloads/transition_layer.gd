extends CanvasLayer
const TRANSITION_SOUND = preload("res://assets/Audio/transition.wav")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
var screen_transition: String = "default"

func change_scene(target: String) -> void:
	# Check if the target file exists 
	if not FileAccess.file_exists(target):
		target = "res://scenes/rooms/load_failed_room.tscn"
	play_transition(false)
	await animation_player.animation_finished
	get_tree().change_scene_to_file(target)
	get_tree().paused = false
	play_transition(true)
	await animation_player.animation_finished
	

func play_transition(reverse: bool = false, speed_scale: float = 1):
	if reverse:
		animation_player.play_backwards(screen_transition)
	else:
		AudioPlayer.play_sound(TRANSITION_SOUND)
		animation_player.play(screen_transition,-1,speed_scale)
	await animation_player.animation_finished
