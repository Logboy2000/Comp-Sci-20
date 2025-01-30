extends CanvasLayer

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var unpause_timer: Timer = $UnpauseTimer
@onready var progress_bar: ProgressBar = $Control/ProgressBar
@onready var panel: Panel = $Control/MarginContainer/Panel
@onready var upgrade_container: GridContainer = $Control/MarginContainer/Panel/VBoxContainer/ScrollContainer/MarginContainer/UpgradeContainer

const UPGRADE_BUTTON = preload("res://scenes/ui/buttons/upgrade_button.tscn")
var upgrade_buttons: Array = []

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
	for i in range(GameManager.settings.get("upgrade_count")):
		upgrade_container.add_child(UPGRADE_BUTTON.instantiate())
	panel.visible = false
	restock()

func _process(_delta: float) -> void:
	if Input.is_action_just_pressed("shop"):
		toggle_menu()
	if Input.is_action_just_pressed("pause") and panel.visible:
		hide_menu()
	progress_bar.value = unpause_timer.time_left

func toggle_menu():
	if panel.visible:
		hide_menu()
	elif not get_tree().paused:
		show_menu()

func hide_menu():
	var exit_anim = exit_animations.pick_random()
	animation_player.play(exit_anim)
	await animation_player.animation_finished
	panel.visible = false
	progress_bar.visible = true
	unpause_timer.start()

func show_menu():
	if GameManager.can_pause:
		var enter_anim = enter_animations.pick_random()
		animation_player.play(enter_anim)
		panel.visible = true
		progress_bar.visible = false
		get_tree().paused = true
		

# Function to restock the shop
func restock() -> void:
	for child: UpgradeButton in upgrade_container.get_children():
		child.new_upgrade()

func _on_restock_button_pressed() -> void:
	restock()


func _on_unpause_timer_timeout() -> void:
	get_tree().paused = false
	progress_bar.visible = false
