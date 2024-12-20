extends CanvasLayer

@onready var animation_player: AnimationPlayer = $AnimationPlayer

var exit_animations = [
	"to_top",
	"to_bottom",
	"to_left",
	"to_right"
]

var enter_animations = [
	"from_top",
	"from_bottom",
	"from_left",
	"from_right"
]


func _ready() -> void:
	visible = false

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("pause"):
		toggle_pause()



func _on_quit_pressed() -> void:
	GameManager.quit_game()


func _on_return_to_title_pressed() -> void:
	TransitionLayer.change_scene("res://scenes/rooms/title_room.tscn")


func _on_resume_pressed() -> void:
	toggle_pause()


func toggle_pause():
	
	if GameManager.can_pause:
		GameManager.can_pause = false
		get_tree().paused = !get_tree().paused
		if get_tree().paused:
			animation_player.play(enter_animations.pick_random())
		else:
			animation_player.play(exit_animations.pick_random())
	await animation_player.animation_finished
	GameManager.can_pause = true
