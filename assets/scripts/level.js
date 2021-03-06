// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import global from './global';

const towerPosNodesStae = {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2,
    Tower: 3,
    UpdateMenu: 4


}


cc.Class({
    extends: cc.Component,

    properties: {
        enemyPahtNodes: {
            default: [],
            type: cc.Node
        },
        towerPosNodes: {
            default: [],
            type: cc.Node
        },
        buildMenuPrefab: {
            default: null,
            type: cc.Prefab

        },
        towerPrefabs: {
            default: [],
            type: cc.Prefab
        },
        updateMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyPrefbs:{
            default:null,
            type:cc.Prefab
        }

    },



    onLoad() {
        for (let i = 0; i < this.towerPosNodes.length; ++i) {
            let node = this.towerPosNodes[i];
            this.setState(node, towerPosNodesStae.Null);
            this.setTouchEvent(node);


        };
        global.event.on("build_tower", this.buildTower.bind(this));
        global.event.on("update_tower", this.updateTower.bind(this));
        global.event.on("sell_tower", this.sellTower.bind(this));
        global.event.on("game_start", this.gameStart.bind(this));

        this.currentWaveCount = 0;
        this.currentEnemyCount = 0;
        this.addEnemyCurrentTime =0;
        this.addWaveCurrentTime=0;

    

    },
    setTouchEvent: function(node) {
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            cc.log("touch node name =" + event.target.name);
            if (node.state == towerPosNodesStae.Null)
                this.showBuildMenu(event.target);
            else if (node.state == towerPosNodesStae.Tower)
                this.showUpdateMenu(event.target);
        });

    },
    closeMenu: function() {
        for (let i = 0; i < this.towerPosNodes.length; ++i) {
            let node = this.towerPosNodes[i];
            if (node.state == towerPosNodesStae.BuildMenu) {

                node.menu.destroy();
                this.setState(node, towerPosNodesStae.Null);
                return node;

            }
            if (node.state == towerPosNodesStae.UpdateMenu) {
                node.menu.destroy();
                this.setState(node, towerPosNodesStae.Tower);
                return node;

            }


        }

    },

    showBuildMenu: function(node) {

        this.closeMenu();
        let menu = cc.instantiate(this.buildMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this.setState(node, towerPosNodesStae.BuildMenu);
        node.menu = menu;

        //else if (node.state == )


    },
    showUpdateMenu: function(node) {
        this.closeMenu();
        let menu = cc.instantiate(this.updateMenuPrefab);
        menu.parent = this.node;
        menu.position = node.position;
        this.setState(node, towerPosNodesStae.UpdateMenu);
        node.menu = menu;

    },

    start() {

    },

    setState: function(node, state) {
        if (node.state == state) {
            return;
        }
        switch (state) {
            case towerPosNodesStae.Null:
                break;
            case towerPosNodesStae.BuildMenu:
                break;
            default:
                break;
        }
        node.state = state;
    },
    buildTower: function(data) {
        cc.log("build tower" + data);
        let node = this.closeMenu();
        let tower = cc.instantiate(this.towerPrefabs[data]);
        tower.parent = this.node;
        tower.position = node.position;
        this.setState(node, towerPosNodesStae.Tower);
        node.tower = tower;

    },
    updateTower: function() {
        let node = this.closeMenu();
        node.tower.getComponent("tower").updateTower();

    },
    sellTower: function() {

        let node = this.closeMenu();

        this.setState(node, towerPosNodesStae.Null);
        node.tower.getComponent("tower").sellTower();

    },
    gameStart:function(){
        cc.loader.loadRes("./config/levelConfig.json",(err,result)=>{
            if(err){
                cc.log("load config err"+err);

            }else{
                cc.log("load succ"+JSON.stringify(result));
            }

            let config = result.json["level_1"];
            this.levelConfig =config;
         //   this.wavesConfig = wavesConfig;
           // this.currentWaveConfig=this.wavesConfig[0];
        });

    },

    addEnemy:function(tyoe){
        //cc.log("add Enemy"+this.currentEnemyCount);
      //  cc.log("add Wave"+this.currentWaveCount)

    },
    addWave:function(){

    },
    onDestroy: function() {
        global.event.off("build_tower", this.buildTower);
    },
    update: function(dt){
        if(this.levelConfig&&this.currentWaveCount<=this.levelConfig.waves.length){
            if(this.currentWaveConfig){
                if(this.addEnemyCurrentTime>this.currentWaveConfig.dt){
                this.addEnemyCurrentTime=0;
                this.currentEnemyCount++;
                this.addEnemy(this.currentWaveConfig.type);
                if(this.currentEnemyCount>=this.currentWaveConfig.count){
                        this.currentWaveConfig=undefined;
                }


                }else{
                this.addEnemyCurrentTime+=dt;
                }

            }else {
                if(this.addWaveCurrentTime>this.levelConfig.dt){
                this.addWaveCurrentTime=0;
                this.currentEnemyCount=0;
                this.currentWaveConfig=this.levelConfig.waves[this.currentWaveCount];
                this.currentWaveCount++;
                 
                }
                else{
                this.addWaveCurrentTime+=dt;
                }
            }

        }
    }

});