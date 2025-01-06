extends CanvasLayer

signal transition_finished

const TRANSITION_SOUND = preload("res://assets/audio/transition.ogg")
@onready var animation_player: AnimationPlayer = $AnimationPlayer

var screen_transition: String = "default"
var transitioning: bool = false
@onready var loading_indicator: RadialProgress = $ColorRect/RadialProgress

# non ai generated™ animation code
var oscillation_time: float = 0.0  # Tracks time for sine wave calculation
var base_speed: float = 10.0       # Base rotation speed
var speed_amplitude: float = 5   # How much the speed varies

func _process(delta: float) -> void:
	oscillation_time += delta
	# sin wave animation shit
	var oscillating_speed = base_speed + speed_amplitude * sin(oscillation_time * TAU)
	loading_indicator.rotation += oscillating_speed * delta


func change_scene(target: String, extra_delay_seconds: float = 0.5) -> void:
	if not transitioning:
		# Check if the target file exists
		if not ResourceLoader.exists(target):
			target = "res://scenes/rooms/load_failed_room.tscn"
		GameManager.can_pause = false
		Audio.fade_out_music()
		play_transition()
		transitioning = true
		await animation_player.animation_finished
		get_tree().paused = true
		
		get_tree().change_scene_to_file(target)
		await get_tree().create_timer(extra_delay_seconds).timeout
		
		
		transitioning = false
		get_tree().paused = false
		play_transition(true)
		await animation_player.animation_finished
		transition_finished.emit()
		GameManager.can_pause = true

func play_transition(reverse: bool = false, speed_scale: float = 1, show_loading: bool = true):
	loading_indicator.visible = show_loading
	oscillation_time = 0
	if reverse:
		animation_player.play_backwards(screen_transition)
	else:
		Audio.play_sound(TRANSITION_SOUND)
		animation_player.play(screen_transition, -1, speed_scale)
	await animation_player.animation_finished
	
