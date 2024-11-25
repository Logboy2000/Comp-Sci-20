class_name Bullet extends Area2D

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@export var bullet_speed: float = 700
var direction: Vector2
var velocity: Vector2

func _ready() -> void:
	velocity = direction * bullet_speed
	# Connect the area_entered signal
	connect("area_entered", Callable(self, "_on_body_entered"))

func _physics_process(_delta: float) -> void:
	position += velocity * _delta

func _on_timer_timeout() -> void:
	animation_player.play("fade_out")

func _on_animation_player_animation_finished(_anim_name: StringName) -> void:
	queue_free()


func _on_body_entered(body: Node2D) -> void:
	if body is Asteroid:
		body.hit()
	queue_free()
