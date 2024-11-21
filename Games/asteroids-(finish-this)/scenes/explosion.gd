extends Area2D


func _on_body_entered(body: Node2D) -> void:
	if body is Asteroid:
		body.hit(5)


func _on_animated_sprite_2d_animation_finished() -> void:
	queue_free()
