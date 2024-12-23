class_name UpgradeButton extends Control

var upgrade_name: String = "speed"

@onready var level_label: Label = $MarginContainer/VBoxContainer/LevelLabel
@onready var icon: TextureRect = $MarginContainer/VBoxContainer/Button/MarginContainer/VBoxContainer/Icon
@onready var button: Button = $MarginContainer/VBoxContainer/Button
@onready var margin_container: MarginContainer = $MarginContainer
@onready var animation_player: AnimationPlayer = $AnimationPlayer

@onready var name_label: Label = $MarginContainer/VBoxContainer/Button/MarginContainer/VBoxContainer/NameLabel
@onready var price_label: Label = $MarginContainer/VBoxContainer/HBoxContainer/PriceLabel
@export var buy_sound: AudioStream

func _ready() -> void:
	new_upgrade()

func _process(_delta: float) -> void:
	pivot_offset = size / 2
	if GameManager.coins < Upgrades.get_price(upgrade_name):
		button.disabled = true
		margin_container.modulate = Color(1, 1, 1, 0.5)
	else:
		button.disabled = false
		margin_container.modulate = Color(1, 1, 1, 1)
	update_labels()

func update_labels() -> void:
	name_label.text = Upgrades.get_display_name(upgrade_name)
	price_label.text = str(Upgrades.get_price(upgrade_name))
	match Upgrades.get_type(upgrade_name):
		Upgrades.UpgradeType.ONE_SHOT:
			level_label.text = "Oneshot"
		Upgrades.UpgradeType.INCREMENTAL:
			level_label.text = "Lv " + str(Upgrades.get_level(upgrade_name))

func _on_button_pressed() -> void:
	AudioPlayer.play_sound(buy_sound)
	Upgrades.buy(upgrade_name)
	new_upgrade()


func new_upgrade():
	if Upgrades.get_does_restock(upgrade_name) == true:
		animation_player.play("buy")
		button.disabled = true
		await animation_player.animation_finished
		upgrade_name = Upgrades.get_random_upgrade_key()
		
		update_labels()
		buy_sound = Upgrades.get_buy_sound(upgrade_name)
		icon.texture = Upgrades.get_icon(upgrade_name)
		
		
		animation_player.play("appear")
		await animation_player.animation_finished
		button.disabled = false
