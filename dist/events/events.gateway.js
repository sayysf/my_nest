"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const run_service_1 = require("./run.service");
const socket_io_1 = require("socket.io");
let EventsGateway = class EventsGateway {
    constructor() {
        this.gameUsers = [];
    }
    handleDisconnect(client) {
        for (let i = 0; i < this.gameUsers.length; i++) {
            if (client.id == this.gameUsers[i].socket.id) {
                this.gameUsers.splice(i, 1);
                break;
            }
        }
        console.log("disconnected = ", client.id);
    }
    handleConnection(client, ...args) {
        console.log("connected = " + client.id);
    }
    afterInit(server) {
        console.log("init");
    }
    async gameEvent(client, data) {
        let com = JSON.parse(data);
        this.gameUsers.push({ user: com.user, socket: client });
        console.log(this.gameUsers.length);
        while (this.gameUsers.length >= 2) {
            new run_service_1.RunService(this.gameUsers[0], this.gameUsers[1]);
            this.gameUsers.splice(0, 1);
            this.gameUsers.splice(0, 1);
            console.log(this.gameUsers.length);
        }
        return data;
    }
    async hiiiEvent(client, data) {
        console.log(data);
        return data;
    }
    async handleEvent(client, data) {
        let com = JSON.parse(data);
        if (com.sender != '' && com.target != '') {
            this.server.emit(com.target, data);
            return data;
        }
        return undefined;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('GAME'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "gameEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('HIII'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "hiiiEvent", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('PRIV'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EventsGateway.prototype, "handleEvent", null);
EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*', } })
], EventsGateway);
exports.EventsGateway = EventsGateway;
//# sourceMappingURL=events.gateway.js.map