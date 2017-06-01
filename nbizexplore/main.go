package main

import (
	"fmt"

	"encoding/base64"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql" // import your used driver
	"github.com/golang/protobuf/proto"
	"github.com/hyperledger/fabric/protos/common"
	"github.com/hyperledger/fabric/protos/utils"
	"strconv"
	"testapi/integration"
	"time"
)

type Channels struct {
	ChannelName       string `orm:"pk"`
	Height            uint64
	CurrentBlockHash  string
	PreviousBlockHash string
}

type Blocks struct {
	Number       uint64 `orm:"pk"`
	PreviousHash string
	DataHash     string
}

type Transactions struct {
	TxID          string `orm:"pk"`
	Type          int32
	version       int32
	Timestamp     string
	ChaincodeName string
	ChannelName   string
	Number        uint64
}

func init() {
	orm.RegisterDriver("mysql", orm.DRMySQL)

	// set default database
	orm.RegisterDataBase("default", "mysql", "root:@tcp(10.213.33.174:13306)/test?charset=utf8")

	// register model
	orm.RegisterModel(new(Channels))
	orm.RegisterModel(new(Blocks))
	orm.RegisterModel(new(Transactions))

	// create table
	orm.RunSyncdb("default", false, true)

}

func main() {
	o := orm.NewOrm()

	testSetup := integration.BaseSetupImpl{
		ConfigFile:      "/app/go/src/nbizexplore/fixtures/config/config_test.yaml",
		ChainID:         "nbizchannel",
		ChannelConfig:   "/app/go/src/nbizexplore/fixtures/channel/nbizchannel.tx",
		ConnectEventHub: true,
	}

	if err := testSetup.Initialize(); err != nil {
		fmt.Errorf(err.Error())
	}

	// Channel info
	channelsInfo, err := testSetup.Chain.QueryInfo()
	if err != nil {
		fmt.Errorf("QueryInfo return error: %v", err)
	}
	channels := new(Channels)
	channels.ChannelName = testSetup.ChainID
	channels.Height = channelsInfo.Height
	channels.CurrentBlockHash = base64.StdEncoding.EncodeToString(channelsInfo.CurrentBlockHash)
	channels.PreviousBlockHash = base64.StdEncoding.EncodeToString(channelsInfo.PreviousBlockHash)

	var maps []orm.Params
	var previousHeight64 int64
	var previousHeight int
	currentHeight := int(channels.Height)
	num, err := o.Raw("SELECT * FROM channels").Values(&maps)
	if num == 0 {
		previousHeight = 0
		_, err := o.Insert(channels)
		if err != nil {
			fmt.Errorf("Channels Insert to mysql return error: %v", err)
		}
	} else {
		previousHeight64, _ = strconv.ParseInt(maps[0]["height"].(string), 10, 64)
		previousHeight = int(previousHeight64)
		_, err := o.Update(channels)
		if err != nil {
			fmt.Errorf("Channels Update to mysql return error: %v", err)
		}
	}
	fmt.Println("PreviousHeight:", previousHeight, "*****CurrentHeight:", channels.Height)
	if previousHeight == currentHeight {
		fmt.Println("No New Block")
		return
	}

	for index := previousHeight; index <= currentHeight-1; index++ {
		blocksInfo, err := testSetup.Chain.QueryBlock(index)
		if err != nil {
			fmt.Errorf("QueryBlock return error: %v", err)
		}

		blocks := new(Blocks)
		blocks.Number = blocksInfo.Header.Number
		blocks.PreviousHash = base64.StdEncoding.EncodeToString(blocksInfo.Header.PreviousHash)
		blocks.DataHash = base64.StdEncoding.EncodeToString(blocksInfo.Header.DataHash)
		_, err = o.Insert(blocks)
		if err != nil {
			fmt.Errorf("Blocks Insert to mysql return error: %v", err)
		}

		for _, d := range blocksInfo.Data.Data {
			if d != nil {
				if env, err := utils.GetEnvelopeFromBlock(d); err != nil {
					fmt.Errorf("GetEnvelopeFromBlock return error: %v", err)
				} else if env != nil {
					transactions := new(Transactions)
					payload := &common.Payload{}
					if err = proto.Unmarshal(env.Payload, payload); err != nil {
					}

					chheader := &common.ChannelHeader{}
					if err = proto.Unmarshal(payload.Header.ChannelHeader, chheader); err != nil {
					}

					transactions.ChannelName = chheader.ChannelId
					transactions.ChaincodeName = "nbizcc"
					transactions.Number = blocks.Number
					transactions.Timestamp = time.Now().Format("2006/01/02 15:04:05.000000")
					transactions.TxID = chheader.TxId
					transactions.version = chheader.Version
					transactions.Type = chheader.Type

					_, err = o.Insert(transactions)
					if err != nil {
						fmt.Errorf("Transactions Insert to mysql return error: %v", err)
					}
				}
			}
		}
	}

}
