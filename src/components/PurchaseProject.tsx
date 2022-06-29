import { useCallback, useState } from 'react';
import { ethers, utils, BigNumber } from 'ethers';
import moment from 'moment';
import { useWeb3React } from '@web3-react/core';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { Project } from 'utils/types';
import { CHAINS } from 'utils/chains';
import { notifyTx } from 'utils/notifications';
import { GenArt721Minter__factory } from 'contracts';
import { expectedChainId, mintContractAddress } from 'config';

interface Props {
  project: Project;
}

const PurchaseProject = ({ project }:Props) => {
  const { chainId, isActive, account, connector, provider } = useWeb3React();
  const startTime = project?.minterConfiguration?.startTime && moment.unix(parseInt(project.minterConfiguration?.startTime?.toString()));
  const usesCustomToken = project?.currencyAddress !== ethers.constants.AddressZero;
  const [pending, setPending] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [mintedToken, setMintedToken] = useState<number | null>(null);
  const weiPrice = BigNumber.from(project.pricePerTokenInWei.toString());

  const connect = useCallback(() => {
    if (connector?.activate) {
      connector.activate();
    }
  }, [connector]);

  const mintAction = () => {
    if (provider && mintContractAddress) {
      const signer = provider.getSigner(account);
      const abMinterContract = GenArt721Minter__factory.connect(mintContractAddress, signer);
      return abMinterContract.purchase(BigNumber.from(project.projectId), {
        value: usesCustomToken ? 0 : weiPrice,
      });
    }
    return Promise.reject(new Error('Mint contract or provider not properly configured'));
  }

  const mint = () => {
    console.log('minting', provider, mintContractAddress);
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
        setMintedToken(tokenId);
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

  // const ApproveAndMint = () => (
  //   <RequiresBalance
  //     amount={BigNumber.from(parseInt(String(utils.formatEther(weiPrice))))}
  //     paymentToken={legendToken}
  //   >
  //     <ApproveERC20
  //       amount={BigNumber.from(parseInt(String(utils.formatEther(weiPrice))))}
  //       paymentToken={legendToken}
  //       spendingContractAddress={mintContractAddress}
  //       approveLabel={`Approve LEGEND`}
  //       chainId={expectedNetwork}
  //       useExact={false}
  //     >
  //       <Mint />
  //     </ApproveERC20>
  //   </RequiresBalance>
  // );
  
  const Mint = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={mint}
    >
      Purchase a mint { utils.formatEther(weiPrice) } { project.currencySymbol }
    </Button>
  );

  return (
    <Mint />
  )
}

export default PurchaseProject;
