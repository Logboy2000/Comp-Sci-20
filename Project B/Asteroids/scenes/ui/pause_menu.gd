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
		toggle_menu()

func toggle_menu():
	if visible:
		hide_menu()
	elif not get_tree().paused:
		show_menu()

func hide_menu():
	get_tree().paused = false
	var exit_anim = exit_animations.pick_random()
	animation_player.play(exit_anim)
	await animation_player.animation_finished
	visible = false


func show_menu():
	if GameManager.can_pause:
		get_tree().paused = true
		visible = true
		var enter_anim = enter_animations.pick_random()
		animation_player.play(enter_anim)


func _on_resume_pressed() -> void:
	hide_menu()


func _on_return_to_title_pressed() -> void:
	TransitionLayer.change_scene("res://scenes/rooms/title_room.tscn")


func _on_quit_pressed() -> void:
	GameManager.quit_game()


func _on_settings_pressed() -> void:
	pass
