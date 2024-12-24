extends Area2D

const EXPLOSION_SOUND = preload("res://assets/Audio/explosion.ogg")

func _ready() -> void:
	AudioPlayer.play_sound(EXPLOSION_SOUND)

func _on_body_entered(body: Node2D) -> void:
	if body is DestructableObject or Player:
		body.hit(5, self)


func _on_animated_sprite_2d_animation_finished() -> void:
	queue_free()
