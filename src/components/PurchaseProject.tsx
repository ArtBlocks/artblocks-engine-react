import { useCallback, useState } from 'react';
import { ethers, utils, BigNumber } from 'ethers';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { ERC20Token, Project } from 'utils/types';
import { CHAINS } from 'utils/chains';
import { notifyTx } from 'utils/notifications';
import { GenArt721Minter__factory } from 'contracts';
import MintSuccessDialog from './MintSuccessDialog';
import RequiresBalance from './RequiresBalance';
import ApproveERC20Token from './ApproveERC20Token';
import { defaultMintGasLimit, expectedChainId, mintContractAddress } from 'config';

interface Props {
  project: Project;
}

const PurchaseProject = ({ project }:Props) => {
  const { chainId, isActive, account, connector, provider } = useWeb3React();
  const startTime = project?.minterConfiguration?.startTime && moment.unix(parseInt(project.minterConfiguration?.startTime?.toString()));
  const usesCustomToken = project?.currencyAddress !== ethers.constants.AddressZero;
  const [pending, setPending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const weiPrice = BigNumber.from(project.pricePerTokenInWei.toString());

  const connect = useCallback(() => {
    if (connector?.activate) {
      connector.activate();
    }
  }, [connector]);

  const mintAction = async () => {
    if (provider && mintContractAddress) {
      const signer = provider.getSigner(account);
      const abMinterContract = GenArt721Minter__factory.connect(mintContractAddress, signer);

      let gasLimit = BigNumber.from(defaultMintGasLimit);
      try {
        gasLimit = await abMinterContract.estimateGas.purchase(BigNumber.from(project.projectId), {
          value: usesCustomToken ? 0 : weiPrice,
        });
      } catch (e) {
        console.log(e);
      }

      return abMinterContract.purchase(BigNumber.from(project.projectId), {
        value: usesCustomToken ? 0 : weiPrice,
        gasLimit,
      });
    }
    return Promise.reject(new Error('Mint contract or provider not properly configured'));
  }

  const mint = () => {
    if (!provider || !mintContractAddress) {
      return; 
    }
    notifyTx({
      method: mintAction,
      chainId: expectedChainId,
      success: 'Your token has been minted!',
      error: 'An error occured while trying to mint.',
      onSuccess: (receipt:any) => {
        const tokenId = parseInt(receipt?.events[0]?.topics[3], 16);
        setMintedTokenId(tokenId);
        setPending(false);
        setSuccessOpen(true);
      },
      onSubmitted: () => setPending(true),
      onError: () => setPending(false),
    }); 
  }

  if (!project) {
    return null;
  }

  if (project.paused) {
    return (
      <Button
        variant="contained"
        color="primary"
        disabled
      >
        Purchases paused
      </Button>
    );
  }

  if (startTime && startTime.isAfter()) {
    return <Alert severity="info">Upcoming</Alert>
  }

  if (!project.active) {
    return <Alert severity="info">Project is not active</Alert>
  }

  if (!project.active) {
    return <Alert severity="info">Project is not active</Alert>
  }

  if (project.complete) {
    return <Alert severity="info">Sold out</Alert>
  }

  if (!isActive) {
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={connect}
      >
        Connect to purchase
      </Button>
    );
  }

  if (chainId !== expectedChainId) {
    return (
      <Alert severity="warning">
        Switch to { CHAINS[expectedChainId]?.name } to purchase
      </Alert>
    );
  }

  let customToken: ERC20Token;
  if (usesCustomToken) {
    customToken = {
      address: project.currencyAddress,
      decimals: 18,
      symbol: project.currencySymbol,
    }
  }
  
  const Mint = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={mint}

    >
      Purchase a mint { utils.formatEther(weiPrice) } { project.currencySymbol }
    </Button>
  );

  const ApproveAndMint = () => {
    if (!mintContractAddress) {
      return (
        <Alert severity="warning">
          Mint contract not configured
        </Alert>
      );
    }
    return (
      <RequiresBalance
        amount={BigNumber.from(parseInt(String(utils.formatEther(weiPrice))))}
        paymentToken={customToken}
      >
        <ApproveERC20Token
          amount={BigNumber.from(parseInt(String(utils.formatEther(weiPrice))))}
          paymentToken={customToken}
          spendingContractAddress={mintContractAddress}
          approveLabel={`Approve LEGEND`}
          chainId={chainId}
          expectedChainId={expectedChainId}
          useExact={false}
        >
          <Mint />
        </ApproveERC20Token>
      </RequiresBalance>
    );
  }

  return (
    <>
      {
        pending ? (
          <LoadingButton
            loading
            variant="outlined"
            color="primary"
          >
            Purchasing
          </LoadingButton>
        ) : usesCustomToken ? <ApproveAndMint /> : <Mint />
      }
      <MintSuccessDialog
        mintedTokenId={String(mintedTokenId)}
        open={successOpen}
        handleClose={() => {
          setSuccessOpen(false)
        }}
      />
    </>
  )
}

export default PurchaseProject;
