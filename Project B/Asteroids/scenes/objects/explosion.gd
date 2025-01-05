class_name Explosion extends Area2D

const EXPLOSION_SOUND = preload("res://assets/audio/explosion.ogg")

func _ready() -> void:
	Audio.play_sound(EXPLOSION_SOUND)

func _on_body_entered(body: Node2D) -> void:
	if body is DestructableObject or body is Player:
		body.hit(2, self)


func _on_animated_sprite_2d_animation_finished() -> void:
	queue_free()
