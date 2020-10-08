import Phaser from 'phaser'

export default class TestScene extends Phaser.Scene {
	constructor(){
		super({key: "TestScene"})
	}

	preload(){

	}

	create(){
		this.rect = this.add.rectangle(1024/2,768/2,128,128,0xff0000)
		this.physics.add.existing(this.rect)

this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

this.gen = ()=> {
	let genRect = this.add.rectangle(1024/2,768/2,128,128,0xff0000)
	this.physics.add.existing(genRect)
	genRect.body.setVelocity(100)
}

	}

	update(){
		this.rect.rotation = (Phaser.Math.Angle.Between(this.input.x , this.input.y, 1024/2, 768/2))

		if(this.spaceBar.isDown){
this.gen()
		}

	}

}
