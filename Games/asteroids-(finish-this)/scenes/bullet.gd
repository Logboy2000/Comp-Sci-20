class_name Bullet extends RigidBody2D

@onready var animation_player: AnimationPlayer = $AnimationPlayer
@export var bullet_speed: float = 700
var direction: Vector2
func _ready() -> void:
	linear_velocity = direction * bullet_speed


func _physics_process(_delta: float) -> void:
	pass


func _on_timer_timeout() -> void:
	animation_player.play("fade_out")


func _on_animation_player_animation_finished(_anim_name: StringName) -> void:
	queue_free()


func _on_body_entered(body: Node) -> void:
	if body is Asteroid:
		body.hit()
		queue_free()
