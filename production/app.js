import { config } from './config.js';
import { getContractData } from './assets/js/contract/connect.js';
import { ModelContractToken, ModelContractAirdrop } from './assets/js/contract/models.js';
import { ethers } from './assets/js/lib/ethers/ethers-5.7.2.esm.min.js';
import './assets/js/lib/jquery/jquery-3.6.4.min.js';

let appState = {
    loading: false
}

async function run() {
    try {
        const contractData = await getContractData();

        const contractToken = new ModelContractToken(contractData);
        const contractAirdrop = new ModelContractAirdrop(contractData);

        // appState.loading = true;

        tabsControl();
        addressListControl(appState);

        let TokenBalanceSigner = await contractToken.contract.balanceOf(contractToken.signer.address);
        $('#token_amount').text(ethers.utils.formatEther(TokenBalanceSigner));

        appState = mintTenFreeTokensControl(contractToken, ethers, config, appState);

        let UserAllowanceToAirdrop = await contractToken.contract.allowance(contractToken.signer.address, contractAirdrop.contract.address);
        $('#allowance_amount').text(ethers.utils.formatEther(UserAllowanceToAirdrop));

        appState = setAllowanceControl(contractToken, contractAirdrop, ethers, config, appState);

        appState = sendAddressControl(contractToken, contractAirdrop, ethers, config, appState);
    
    } catch (err) {
        $('#token_log_message').text('ERROR! Check console for details');
        console.log(err);
        return false;
    }

}


$(async function() {
    if (window.ethereum) {
        await run();
        window.ethereum.on('accountsChanged', async function () {
            $('#address_ul').html('');
            $('#token_log_message').text('');
            $('#airdrop_log_message').text('');
            await run();
        })
    } else {
        $('#token_log_message').text('ERROR! Metamask not found. Connect metamask and refresh page');
        $('#airdrop_log_message').text('ERROR! Metamask not found. Connect metamask and refresh page');
    } 
});


function tabsControl() {
    $('.tabs').off('click');
    $('.tabs').on('click', function(){
        $('.tabs').removeClass('active');
        $('.tabs-container').hide();
        $(this).addClass('active');
        
        let id =  $(this).attr('data-open');
        $('#' + id).show();
    });
}


function addressListControl() {
    $('#address_input_add').off('click');
    $('.badge-delete').off('click');
    
    $('#address_input_add').on('click', function() {

        let address = $('#address_input').val().trim();

        if (address == "") {
            $('#airdrop_log_message').text('ERROR! Address cannot be empty');
            return false;
        }

        if (!ethers.utils.isAddress(address)) {
            $('#airdrop_log_message').text('ERROR! Not valid address');
            return false;
        }

        let html = `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span class="send_to_address">${address}</span>
                <span class="badge btn btn-danger rounded-pill badge-delete">Delete</span>
            </li>
        `;

        $('#address_input').val('');
        $('#address_ul').prepend(html);

        $('.badge-delete').off('click');
        $('.badge-delete').on('click', function() {
            $(this).parent().remove();
        });
    });

    $('.badge-delete').on('click', function() {
        $(this).parent().remove();
    });
}

async function mintTenFreeTokensControl(contractToken, ethers, config, appState) {
    
    $('#mint_tokens').off('click');
    $('#mint_tokens').on('click', async function() {
        try {
            if (appState.loading) {
                return appState;
            }
            appState.loading = true;
            let mintData = await contractToken.contract.mintTenTokens({gasLimit: config.BASE_GAS_LIMIT});
            mintData = await mintData.wait();
            let TokenBalanceSigner = await contractToken.contract.balanceOf(contractToken.signer.address);
            $('#token_amount').text(ethers.utils.formatEther(TokenBalanceSigner));
            $('#token_log_message').text('Minted 10 tokens!');
            appState.loading = false;
            return appState;
        } catch(err) {
            $('#token_log_message').text('ERROR. Check console for details');
            console.log(err);
            appState.loading = false;
            return appState;
        }
    });

}

async function setAllowanceControl(contractToken, contractAirdrop, ethers, config, appState) {
    $('#approve_airdrop').off('click');
    $('#approve_airdrop').on('click', async function() {
        try {
            if (appState.loading) {
                return appState;
            }

            let approveAmount = $('#approve_amount').val().trim();

            if (approveAmount == "") {
                $('#token_log_message').text('ERROR! Approve is empty');
                return appState;
            }

            approveAmount = parseInt(approveAmount);

            if (isNaN(approveAmount)) {
                $('#token_log_message').text('ERROR! Wrong input');
                return appState;
            }

            if (approveAmount == 0) {
                $('#token_log_message').text('ERROR! Minimum is 1');
                return appState;
            }

            appState.loading = true;

            $('#token_log_message').text('Loading...');

            let TokenBalanceSigner = await contractToken.contract.balanceOf(contractToken.signer.address);
            
            TokenBalanceSigner = parseInt(ethers.utils.formatEther(TokenBalanceSigner));

            if (approveAmount > TokenBalanceSigner) {
                $('#token_log_message').text('ERROR! Approve is too big');
                appState.loading = false;
                return appState;
            }

            approveAmount = approveAmount.toString();
            
            let approveData = await contractToken.contract.approve(contractAirdrop.contract.address, ethers.utils.parseUnits(approveAmount), {gasLimit: config.BASE_GAS_LIMIT});
            approveData = await approveData.wait();

            TokenBalanceSigner = await contractToken.contract.balanceOf(contractToken.signer.address);
            let UserAllowanceToAirdrop = await contractToken.contract.allowance(contractToken.signer.address, contractAirdrop.contract.address);

            $('#allowance_amount').text(ethers.utils.formatEther(UserAllowanceToAirdrop));
            $('#token_amount').text(ethers.utils.formatEther(TokenBalanceSigner));
            $('#token_log_message').text('Approve is set');
            $('#approve_amount').val('');

            appState.loading = false;
            return appState;
        } catch(err) {
            $('#token_log_message').text('ERROR. Check console for details');
            console.log(err);
            appState.loading = false;
            return appState;
        }
    });
}


async function sendAddressControl(contractToken, contractAirdrop, ethers, config, appState) {
    $('#address_send').off('click');
    $('#address_send').on('click', async function() {
        try {
            
            if (appState.loading) {
                return appState;
            }

            let addressElements = $('.send_to_address');
            let tokenAmount = $('#token_amount_input').val().trim();

            if (tokenAmount == "") {
                $('#airdrop_log_message').text('ERROR! Token amount is empty');
                return appState;
            }

            tokenAmount = parseInt(tokenAmount);

            if (isNaN(tokenAmount)) {
                $('#airdrop_log_message').text('ERROR! Wrong input');
                return appState;
            }

            if (tokenAmount == 0) {
                $('#airdrop_log_message').text('ERROR! Minimum is 1');
                return appState;
            }

            appState.loading = true;

            $('.badge-delete').hide();

            $('#airdrop_log_message').text('Loading...');

            let TokenBalanceSigner = await contractToken.contract.balanceOf(contractToken.signer.address);
            TokenBalanceSigner = parseInt(ethers.utils.formatEther(TokenBalanceSigner));

            
            let addressArray = [];
            addressElements.each(function( index, value ) {
                let address = $(value).text().trim();
                if (ethers.utils.isAddress(address)) {
                    addressArray.push(address);
                }
            });

            if (addressArray.length == 0) {
                $('#token_log_message').text('ERROR! address list is empty');
                appState.loading = false;
                return appState;
            }

            if (tokenAmount * addressArray.length  > TokenBalanceSigner) {
                $('#token_log_message').text('ERROR! Not enough tokens');
                appState.loading = false;
                return appState;
            }

            let UserAllowanceToAirdrop = await contractToken.contract.allowance(contractToken.signer.address, contractAirdrop.contract.address);
            UserAllowanceToAirdrop = parseInt(ethers.utils.formatEther(UserAllowanceToAirdrop))

            if (tokenAmount * addressArray.length  > UserAllowanceToAirdrop) {
                $('#token_log_message').text('ERROR! Not enough allowance');
                appState.loading = false;
                return appState;
            }


            let sendTokensData = await contractAirdrop.contract.airdropTokensFromAddressBalance(addressArray, ethers.utils.parseUnits(tokenAmount.toString()));
            
            sendTokensData = await sendTokensData.wait();

            let TokenBalanceSigner2 = await contractToken.contract.balanceOf(contractToken.signer.address);
            let UserAllowanceToAirdrop2 = await contractToken.contract.allowance(contractToken.signer.address, contractAirdrop.contract.address);

            $('#allowance_amount').text(ethers.utils.formatEther(UserAllowanceToAirdrop2));
            $('#token_amount').text(ethers.utils.formatEther(TokenBalanceSigner2));

            $('#address_ul').html('');
            $('#token_amount_input').val('');
            
            $("#airdrop_log_message").text("SENDED!");

            appState.loading = false;
            return appState;
        } catch (err) {
            $("#airdrop_log_message").text("ERROR. Check console for details");
            $('.badge-delete').show();
            console.log(err);
            appState.loading = false;
            return appState;
        }
    });
}

/*

later

const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
provider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
        window.location.reload();
    }
});
*/
