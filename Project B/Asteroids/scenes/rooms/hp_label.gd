extends Label

var hp: int = 0
var max_hp: int = 0
@onready var hp_bar: RadialProgress = $".."
@onready var animation_player: AnimationPlayer = $"../AnimationPlayer"

func _ready() -> void:
	GameManager.player.player_hurt.connect(Callable(self, "_hurt"))

func _process(_delta: float) -> void:
	if GameManager.player != null:
		hp = GameManager.player.hp
		max_hp = GameManager.player.max_hp
		if GameManager.player.in_danger == true:
			animation_player.play("damage_flash")
	else:
		hp = 0
	hp_bar.max_value = lerp(hp_bar.max_value, float(max_hp), 0.1)
	hp_bar.progress = lerp(hp_bar.progress, float(hp), 0.05)
	text = str(hp)

func _hurt():
	animation_player.play("damage_flash")
