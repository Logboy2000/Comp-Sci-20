extends HBoxContainer

@onready var coin_label: Label = $CoinLabel
@onready var animation_player: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
	GameManager.coins_increased.connect(Callable(self, "_increase_animation"))

func _process(_delta: float) -> void:
	coin_label.text = str(GameManager.coins)
	if scale > Vector2(1,1):
		scale -= Vector2(0.1, 0.1)

func _increase_animation():
	animation_player.play("collect")
