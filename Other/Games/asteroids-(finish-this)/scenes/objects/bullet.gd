class_name Bullet extends Area2D
const ASTEROID_HIT_PARTICLE = preload("res://scenes/particles/asteroid_hit_particle.tscn")
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@export var bullet_speed: float = 700
@export var bullet_hp: int = 1
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
	var particle = ASTEROID_HIT_PARTICLE.instantiate()
	particle.position = global_position
	add_sibling(particle)
	
	bullet_hp -= 1
	if bullet_hp <= 0:
		queue_free()
