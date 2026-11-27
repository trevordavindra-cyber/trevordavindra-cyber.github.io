(function(){
"use strict";
function strip(){
  var s = document.getElementById("toolstrip");
  if (!s){ s = document.createElement("div"); s.id = "toolstrip"; var f = document.getElementById("composer"); f.parentNode.insertBefore(s, f); }
  return s;
}
function panel(title, btn){
  var p = document.createElement("div");
  p.className = "toolpanel hidden";
  var h = document.createElement("div"); h.className = "tphead";
  var t = document.createElement("div"); t.className = "tlabel"; t.textContent = title;
  var x = document.createElement("button"); x.className = "tpx"; x.textContent = "\u2715";
  x.addEventListener("click", function(){ p.classList.add("hidden"); btn.classList.remove("active"); });
  h.appendChild(t); h.appendChild(x); p.appendChild(h);
  document.body.appendChild(p);
  return p;
}
var S = [
["leaderstats", "local Players = game:GetService(\"Players\")\n\nPlayers.PlayerAdded:Connect(function(plr)\n  local stats = Instance.new(\"Folder\")\n  stats.Name = \"leaderstats\"\n  stats.Parent = plr\n  local kills = Instance.new(\"IntValue\")\n  kills.Name = \"Kills\"\n  kills.Parent = stats\nend)"],
["datastore save/load", "local DSS = game:GetService(\"DataStoreService\")\nlocal store = DSS:GetDataStore(\"PlayerData\")\n\nlocal function load(plr)\n  local ok, data = pcall(function()\n    return store:GetAsync(\"plr_\" .. plr.UserId)\n  end)\n  return ok and data or {coins = 0}\nend\n\nlocal function save(plr, data)\n  pcall(function()\n    store:SetAsync(\"plr_\" .. plr.UserId, data)\n  end)\nend"],
["remote event pair", "-- Server (ServerScriptService)\nlocal re = game.ReplicatedStorage.DoThing\nre.OnServerEvent:Connect(function(plr, amount)\n  if typeof(amount) ~= \"number\" then return end\n  if amount <= 0 or amount > 100 then return end -- sanity check\n  -- do the thing server-side\nend)\n\n-- Client (StarterPlayerScripts)\nlocal re = game.ReplicatedStorage.DoThing\nre:FireServer(10)"],
["tween a part", "local TS = game:GetService(\"TweenService\")\nlocal part = workspace.Part\nlocal info = TweenInfo.new(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out)\nlocal goal = {Position = part.Position + Vector3.new(0, 10, 0)}\nTS:Create(part, info, goal):Play()"],
["raycast", "local params = RaycastParams.new()\nparams.FilterType = Enum.RaycastFilterType.Exclude\nparams.FilterDescendantsInstances = {character}\nlocal result = workspace:Raycast(origin, direction * 100, params)\nif result then print(result.Instance, result.Position) end"],
["cooldown debounce", "local cooldown = false\nbutton.Activated:Connect(function()\n  if cooldown then return end\n  cooldown = true\n  -- do the thing\n  task.wait(2)\n  cooldown = false\nend)"],
["oop module", "-- ModuleScript in ReplicatedStorage\nlocal Class = {}\nClass.__index = Class\nfunction Class.new(x)\n  local self = setmetatable({}, Class)\n  self.x = x\n  return self\nend\nfunction Class:get() return self.x end\nreturn Class"],
["on touch damage", "local part = script.Parent\npart.Touched:Connect(function(hit)\n  local hum = hit.Parent and hit.Parent:FindFirstChildOfClass(\"Humanoid\")\n  if hum then hum:TakeDamage(10) end\nend)"],
["play animation", "local hum = character:WaitForChild(\"Humanoid\")\nlocal anim = Instance.new(\"Animation\")\nanim.AnimationId = \"rbxassetid://YOUR_ID\"\nlocal track = hum:LoadAnimation(anim)\ntrack:Play(0.2)"],
["walkspeed + jump", "local hum = character:WaitForChild(\"Humanoid\")\nhum.WalkSpeed = 24\nhum.UseJumpPower = true\nhum.JumpPower = 60"],
["billboard nametag", "local bb = Instance.new(\"BillboardGui\")\nbb.Size = UDim2.new(0, 120, 0, 30)\nbb.StudsOffset = Vector3.new(0, 2.5, 0)\nbb.AlwaysOnTop = true\nlocal label = Instance.new(\"TextLabel\")\nlabel.Size = UDim2.new(1, 0, 1, 0)\nlabel.BackgroundTransparency = 1\nlabel.Text = player.Name\nlabel.TextScaled = true\nlabel.Parent = bb\nbb.Parent = head"],
["admin check", "local ADMINS = { [123456789] = true } -- userIds\nlocal function isAdmin(plr)\n  return ADMINS[plr.UserId] == true\nend"],
["round timer loop", "while true do\n  for t = 30, 1, -1 do\n    status.Value = \"Round ends in \" .. t\n    task.wait(1)\n  end\n  -- run the round here\n  task.wait(5)\nend"],
["sprint (shift)", "-- LocalScript, StarterPlayerScripts\nlocal UIS = game:GetService(\"UserInputService\")\nlocal plr = game.Players.LocalPlayer\nlocal hum = plr.Character:WaitForChild(\"Humanoid\")\nUIS.InputBegan:Connect(function(input, gp)\n  if gp then return end\n  if input.KeyCode == Enum.KeyCode.LeftShift then hum.WalkSpeed = 28 end\nend)\nUIS.InputEnded:Connect(function(input)\n  if input.KeyCode == Enum.KeyCode.LeftShift then hum.WalkSpeed = 16 end\nend)"],
["pathfinding move", "local PFS = game:GetService(\"PathfindingService\")\nlocal path = PFS:CreatePath({AgentRadius = 2, AgentHeight = 5, AgentCanJump = true})\nlocal ok = pcall(function() path:ComputeAsync(start, goal) end)\nif ok and path.Status == Enum.PathStatus.Success then\n  for _, wp in ipairs(path:GetWaypoints()) do\n    hum:MoveTo(wp.Position)\n    hum.MoveToFinished:Wait()\n  end\nend"],
["gui button toggle", "local btn = script.Parent\nlocal frame = btn.Parent.Frame\nbtn.Activated:Connect(function()\n  frame.Visible = not frame.Visible\nend)"],
["spawn part on timer", "while true do\n  local p = Instance.new(\"Part\")\n  p.Size = Vector3.new(2, 2, 2)\n  p.Position = Vector3.new(0, 10, 0)\n  p.Parent = workspace\n  game.Debris:AddItem(p, 10)\n  task.wait(5)\nend"],
["tool damage on hit", "local tool = script.Parent\ntool.Activated:Connect(function()\n  local root = tool.Parent:FindFirstChild(\"HumanoidRootPart\")\n  if not root then return end\n  for _, plr in ipairs(game.Players:GetPlayers()) do\n    local h = plr.Character and plr.Character:FindFirstChildOfClass(\"Humanoid\")\n    local r = plr.Character and plr.Character:FindFirstChild(\"HumanoidRootPart\")\n    if h and r and r ~= root and (r.Position - root.Position).Magnitude < 6 then\n      h:TakeDamage(15)\n    end\n  end\nend)"]
];
var btn = document.createElement("button");
btn.className = "toolbtn"; btn.textContent = "snips"; btn.title = "Luau snippet library";
var p = panel("luau snippets", btn);
S.forEach(function(s){
  var b = document.createElement("button");
  b.className = "snip";
  var t = document.createElement("span");
  t.textContent = s[0];
  b.appendChild(t);
  var c = document.createElement("span");
  c.style.cssText = "display:block;color:var(--sub);font-size:10px";
  c.textContent = s[1].split("\n")[0].replace(/^\s*--\s*/, "");
  b.appendChild(c);
  b.addEventListener("click", function(){
    KODEX.inputEl.value = s[1];
    KODEX.inputEl.focus();
    p.classList.add("hidden"); btn.classList.remove("active");
  });
  p.appendChild(b);
});
btn.addEventListener("click", function(){
  var open = !p.classList.contains("hidden");
  document.querySelectorAll(".toolpanel").forEach(function(z){ z.classList.add("hidden"); });
  document.querySelectorAll(".toolbtn").forEach(function(z){ z.classList.remove("active"); });
  if (!open){ p.classList.remove("hidden"); btn.classList.add("active"); }
});
strip().appendChild(btn);
})();
