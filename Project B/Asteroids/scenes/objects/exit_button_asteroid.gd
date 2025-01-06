extends Asteroid

func destroy():
	super.destroy()
	GameManager.quit_game()
