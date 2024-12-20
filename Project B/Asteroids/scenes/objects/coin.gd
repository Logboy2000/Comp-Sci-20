class_name Coin extends Area2D

func _on_timer_timeout() -> void:
	queue_free()
