extends Asteroid
const EXPLOSION = preload("res://scenes/objects/explosion.tscn")
# Override the destroy function with custom behavior for ExplosiveAsteroid
func destroy():
	GameManager.shake_camera(15)
	var new_explosion = EXPLOSION.instantiate()
	new_explosion.position = global_position
	call_deferred("add_sibling", new_explosion)
	
	
	# Call the base class's destroy function to retain existing behavior
	super.destroy()
