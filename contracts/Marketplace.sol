// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
    // Variables
    address payable public immutable feeAccount; // the account that receives fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;

    uint256 listPrice = 0.01 ether;


    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        address payable buyer;
        bool sold;
    }

    // itemId -> Item
    mapping(uint => Item) public items;

    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    // Make item to offer on the marketplace
    function makeItem(
        IERC721 _nft,
        uint _tokenId,
        uint _price

    ) external payable nonReentrant {
        require(msg.value == listPrice, "Hopefully sending the correct price");
        require(_price > 0, "Price must be greater than zero");
        // increment itemCount
        itemCount++;
        // transfer nft
        _nft.transferFrom(msg.sender, address(this), _tokenId);
        // add new item to items mapping
        items[itemCount] = Item(
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            payable(address(this)),
            false
        );
        // emit Offered event
        emit Offered(itemCount, address(this), _tokenId, _price, msg.sender);
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(
            msg.value >= _totalPrice,
            "not enough ether to cover item price and market fee"
        );
        require(!item.sold, "item already sold");
        // pay seller and feeAccount
        item.seller.transfer(item.price);
        
        feeAccount.transfer(_totalPrice - item.price);
        // update item to sold
        item.sold = true;
        item.buyer = payable(address(0));

        // transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);
        // emit Bought event
        emit Bought(
            _itemId,
            address(item.nft),
            item.tokenId,
            item.price,
            item.seller,
            msg.sender
        );

    }
// function createOffer(uint _itemId, uint _price) external nonReentrant {
//     Item storage item = items[_itemId];

//     // require(
//     //     item.buyer == msg.sender,
//     //     "Only the current owner can create an offer to resell the item"
//     // );
//     // require(!item.sold, "Item already sold");
//     // require(
//     //     _price > item.price,
//     //     "Resell price must be greater than the original price"
//     // );

//     // update item seller to msg.sender
//     item.seller = item.buyer;

//     // add new item to items mapping
//     itemCount++;
//     items[itemCount] = Item(
//         itemCount,
//         item.nft,
//         item.tokenId,
//         _price,
//         item.buyer,
//         payable(msg.sender),
//         false
//     );
//     // emit Offered event
//     emit Offered(
//         itemCount,
//         address(item.nft),
//         item.tokenId,
//         _price,
//         item.buyer
//     );
// }
    function resellTokenAgain(IERC721 _nft,uint256  _itemId, uint256 _price) external payable nonReentrant {
        require(
            items[_itemId].buyer == msg.sender,
            "Only item owner can perform this operation"
        );
        itemCount++;
        items[_itemId].sold = false;
        items[_itemId].price = _price;
        items[_itemId].seller = payable(msg.sender);
        items[_itemId].buyer = payable(address(this));
// struct Item {
//         uint itemId;
//         IERC721 nft;
//         uint tokenId;
//         uint price;
//         address payable seller;
//         address payable buyer;
//         bool sold;
//     }

        _nft.transferFrom(msg.sender, address(this), _itemId);
    }
    function getTotalPrice(uint _itemId) public view returns (uint) {
        return ((items[_itemId].price * (100 + feePercent)) / 100);
    }
    
}

