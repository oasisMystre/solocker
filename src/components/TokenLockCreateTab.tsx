import { Fragment, useState } from "react";
import { Tab } from "@headlessui/react";

import { Config } from "@/lib/models/config.model";
import { LpInfo } from "@/lib/api/models/raydium.model";

import TokenLockCreateSelectToken from "./TokenLockCreateSelectToken";
import TokenLockCreateConfiguration from "./TokenLockCreateConfiguration";

type TokenLockCreateTabProps = {
  lpInfos: LpInfo[];
};

export default function TokenLockCreateTab({
  lpInfos,
}: TokenLockCreateTabProps) {
  const [formIndex, setFormIndex] = useState(0);
  const [lpInfo, setLpInfo] = useState<LpInfo>();
  const [config, setConfig] = useState<Omit<Config, "token">>();
  
  return (
    <Tab.Group
      as="div"
      key={formIndex}
      selectedIndex={formIndex}
      className="flex flex-col space-y-8 bg-dark/50 p-4 rounded-xl"
    >
      <Tab.Panels>
        <Tab.Panel as={Fragment}>
          <TokenLockCreateSelectToken
            lpInfos={lpInfos}
            value={lpInfo}
            onSelect={setLpInfo}
          />
        </Tab.Panel>
        <Tab.Panel as={Fragment}>
          <TokenLockCreateConfiguration
            value={config}
            setValue={setConfig} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

