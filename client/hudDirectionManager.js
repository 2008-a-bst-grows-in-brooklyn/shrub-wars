import Phaser from "phaser";
export default class HudDirectionManager {
  constructor(scene, friends, flag) {
    this.scene = scene;
    this.me = {
      x: this.scene.cameras.main.scrollX + 256,
      y: this.scene.cameras.main.scrollY + 256,
    }; // Client position
    console.log(this.me.x);
    this.friendPosList = friends; // list of friendly player positions
    this.friends = []; // friendly player gameObjects
    this.flag = flag; // flag position
    this.cameraViewBox = {
      left: new Phaser.Geom.Line(
        this.scene.cameras.main.scrollX,
        this.scene.cameras.main.scrollY,
        this.scene.cameras.main.scrollX,
        this.scene.cameras.main.scrollY + 512
      ),
      top: new Phaser.Geom.Line(
        this.scene.cameras.main.scrollX,
        this.scene.cameras.main.scrollY,
        this.scene.cameras.main.scrollX + 512,
        this.scene.cameras.main.scrollY
      ),
      right: new Phaser.Geom.Line(
        this.scene.cameras.main.scrollX + 512,
        this.scene.cameras.main.scrollY,
        this.scene.cameras.main.scrollX + 512,
        this.scene.cameras.main.scrollY + 512
      ),
      bottom: new Phaser.Geom.Line(
        this.scene.cameras.main.scrollX + 512,
        this.scene.cameras.main.scrollY + 512,
        this.scene.cameras.main.scrollX,
        this.scene.cameras.main.scrollY + 512
      ),
    };
  }
  setup() {
    // Set up initial lines
    // Creates the player and flag lines needed for intersection tests
    for (let i = 0; i < this.friendPosList.length; i++) {
      this.friendPosList[i].line = new Phaser.Geom.Line(
        this.me.x,
        this.me.y,
        this.friendPosList[i].x,
        this.friendPosList[i].y
      );
      this.friends.push(
        this.scene.add.rectangle(0, 0, 16, 16, 0x00ff00).setDepth(1)
      );
    }
    console.log(this.cameraViewBox);
    this.flag.line = new Phaser.Geom.Line(
      this.me.x,
      this.me.y,
      this.flag.x,
      this.flag.y
    );
    this.flag.point = this.scene.add
      .rectangle(0, 0, 16, 16, 0xffb233)
      .setDepth(1);
  }
  getIntersections() {
    // Find where lines intersect
    // Placeholder points for intersections
    let intersectPointLeft = new Phaser.Geom.Point();
    let intersectPointTop = new Phaser.Geom.Point();
    let intersectPointRight = new Phaser.Geom.Point();
    let intersectPointBottom = new Phaser.Geom.Point();
    // Boolean placeholders for when a intersection occurs
    let intersectLeft, intersectTop, intersectRight, intersectBottom;
    // Goes through every friend line and checks for intersections
    for (let i = 0; i < this.friendPosList.length; i++) {
      this.friends[i].visible = false;
      intersectLeft = Phaser.Geom.Intersects.LineToLine(
        this.friendPosList[i].line,
        this.cameraViewBox.left,
        intersectPointLeft
      );
      intersectTop = Phaser.Geom.Intersects.LineToLine(
        this.friendPosList[i].line,
        this.cameraViewBox.top,
        intersectPointTop
      );
      intersectRight = Phaser.Geom.Intersects.LineToLine(
        this.friendPosList[i].line,
        this.cameraViewBox.right,
        intersectPointRight
      );
      intersectBottom = Phaser.Geom.Intersects.LineToLine(
        this.friendPosList[i].line,
        this.cameraViewBox.bottom,
        intersectPointBottom
      );
      // Set direction box of current friend to the new location
      if (intersectLeft || intersectTop || intersectRight || intersectBottom) {
        this.friends[i].visible = true;
      }
      if (intersectLeft) {
        this.friends[i].setPosition(intersectPointLeft.x, intersectPointLeft.y);
      } else if (intersectTop) {
        this.friends[i].setPosition(intersectPointTop.x, intersectPointTop.y);
      } else if (intersectRight) {
        this.friends[i].setPosition(
          intersectPointRight.x,
          intersectPointRight.y
        );
      } else if (intersectBottom) {
        this.friends[i].setPosition(
          intersectPointBottom.x,
          intersectPointBottom.y
        );
      }
    }
    // Checks flag line intersection
    this.flag.point.visible = false;
    intersectLeft = Phaser.Geom.Intersects.LineToLine(
      this.flag.line,
      this.cameraViewBox.left,
      intersectPointLeft
    );
    intersectTop = Phaser.Geom.Intersects.LineToLine(
      this.flag.line,
      this.cameraViewBox.top,
      intersectPointTop
    );
    intersectRight = Phaser.Geom.Intersects.LineToLine(
      this.flag.line,
      this.cameraViewBox.right,
      intersectPointRight
    );
    intersectBottom = Phaser.Geom.Intersects.LineToLine(
      this.flag.line,
      this.cameraViewBox.bottom,
      intersectPointBottom
    );
    if (intersectLeft || intersectTop || intersectRight || intersectBottom) {
      this.flag.point.visible = true;
    }
    if (intersectLeft) {
      this.flag.point.setPosition(intersectPointLeft.x, intersectPointLeft.y);
    } else if (intersectTop) {
      this.flag.point.setPosition(intersectPointTop.x, intersectPointTop.y);
    } else if (intersectRight) {
      this.flag.point.setPosition(intersectPointRight.x, intersectPointRight.y);
    } else if (intersectBottom) {
      this.flag.point.setPosition(
        intersectPointBottom.x,
        intersectPointBottom.y
      );
    }
  }
  updatePos(newPos) {
    // update the positions stored
    this.me.x = this.scene.cameras.main.scrollX + 256;
    this.me.y = this.scene.cameras.main.scrollY + 256;
    for (let i = 0; i < newPos.friendPos.length; i++) {
      if (this.friendPosList[i] !== undefined) {
        this.addFriend(newPos.friendPos[i]);
      } else {
        this.friendPosList[i].x = newPos.friendPos[i].x;
        this.friendPosList[i].y = newPos.friendPos[i].y;
        this.updateLine(this.friendPosList[i]);
      }
    }
    this.flag.x = newPos.flag.x;
    this.flag.y = newPos.flag.y;
    this.updateLine(this.flag);
  }
  updateLine(Obj) {
    // Update lines to newest positions
    Obj.line.setTo(this.me.x, this.me.y, Obj.x, Obj.y);
  }
  addFriend(newFriend) {
    // If a new friend joins in
    newFriend.line = new Phaser.Geom.Line(
      this.me.x,
      this.me.y,
      newFriend.x,
      newFriend.y
    );
    this.friends.push(
      this.scene.add.rectangle(0, 0, 16, 16, 0x00ff00).setDepth(1)
    );
    this.friendPosList.push(newFriend);
  }
  updateCameraBox() {
    // Updates current camera view box lines
    this.cameraViewBox.left.setTo(
      this.scene.cameras.main.scrollX,
      this.scene.cameras.main.scrollY,
      this.scene.cameras.main.scrollX,
      this.scene.cameras.main.scrollY + 512
    );
    this.cameraViewBox.top.setTo(
      this.scene.cameras.main.scrollX,
      this.scene.cameras.main.scrollY,
      this.scene.cameras.main.scrollX + 512,
      this.scene.cameras.main.scrollY
    );
    this.cameraViewBox.right.setTo(
      this.scene.cameras.main.scrollX + 512,
      this.scene.cameras.main.scrollY,
      this.scene.cameras.main.scrollX + 512,
      this.scene.cameras.main.scrollY + 512
    );
    this.cameraViewBox.bottom.setTo(
      this.scene.cameras.main.scrollX + 512,
      this.scene.cameras.main.scrollY + 512,
      this.scene.cameras.main.scrollX,
      this.scene.cameras.main.scrollY + 512
    );
  }
  updater(newPositions) {
    this.updateCameraBox();
    this.updatePos(newPositions);
    this.getIntersections();
  }
  removePlayer(playerList) {
    for (let i = 0; i < this.friendPosList.length; i++) {
      if (!playerList.includes(this.friendPosList[i])) {
        this.friends[i].destroy();
        this.friends = this.friends.filter(
          (friend) => friend !== this.friends[i]
        );
        this.friendPosList = this.friendPosList.filter(
          (friend) => friend !== this.friendPosList[i]
        );
      }
    }
  }
}
