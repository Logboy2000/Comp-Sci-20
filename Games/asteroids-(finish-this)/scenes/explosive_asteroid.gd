extends Asteroid
const EXPLOSION = preload("res://scenes/explosion.tscn")
# Override the destroy function with custom behavior for ExplosiveAsteroid
func destroy():
	
	var new_explosion = EXPLOSION.instantiate()
	new_explosion.position = global_position
	call_deferred("add_sibling", new_explosion)
	
	
	# Call the base class's destroy function to retain existing behavior
	AudioPlayer.play_sound(DESTROY_SOUND)
	var particle = ASTEROID_EXPLOSION_PARTICLE.instantiate()
	particle.position = global_position
	particle.modulate = modulate
	add_sibling(particle)
